import { supabase } from './supabase';
import { scheduleTaskNotificationGrid } from './notificationEngine';

interface ParsedTask {
  title: string;
  duration: number; // in minutes
  deadline: string;  // YYYY-MM-DD HH:mm format
}

/**
 * 📨 Fetches unread email headers and snippets from Gmail
 */
export async function fetchLatestEmailContext(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(
      'https://gmail.googleapis.com/v1/users/me/messages?q=is:unread&maxResults=3',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    const data = await response.json();
    if (!data.messages || data.messages.length === 0) return [];

    const snippets: string[] = [];

    for (const msg of data.messages) {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/v1/users/me/messages/${msg.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const detailData = await detailResponse.json();
      if (detailData.snippet) {
        snippets.push(detailData.snippet);
      }
    }

    return snippets;
  } catch (error) {
    console.error('Failed to extract context from Gmail stream:', error);
    return [];
  }
}

/**
 * 🧠 Ships email text to Google AI Studio (Gemini 1.5 Flash) to structure it into a clean JSON array
 */
export async function analyzeEmailsWithGemini(emails: string[], geminiApiKey: string): Promise<ParsedTask[]> {
  if (emails.length === 0) return [];

  const combinedText = emails.map((text, index) => `[Email ${index + 1}]: ${text}`).join('\n\n');
  
  const systemPrompt = `You are an advanced AI parsing coordinator. Analyze the following unread email context and extract actionable tasks. 
  For each task, define a concise title, an estimated duration in minutes, and extract/infer a deadline date formatted strictly as "YYYY-MM-DD HH:mm". 
  Current reference timeline context is ${new Date().toISOString()}.
  Return ONLY a valid JSON array of objects matching this format: [{"title": "Task name", "duration": 30, "deadline": "2026-06-30 14:00"}]. Do not include markdown blocks, text formatting, or extra prose.`;

  // 🛰️ Hit the official Google AI Studio REST Endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\n[Email Context Data]:\n${combinedText}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json' // Forces Gemini to output pure JSON
        }
      }),
    });

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Fallback boundary parsing to guarantee clean arrays
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']') + 1;
    
    if (startIdx !== -1 && endIdx !== -1) {
      return JSON.parse(rawText.substring(startIdx, endIdx));
    }
    return [];
  } catch (error) {
    console.error('Google Gemini intelligence mapping failure:', error);
    return [];
  }
}

/**
 * ⚡ Main orchestration vector: Ingests, processes via Gemini, and pushes to Supabase
 */
export async function syncGmailToSupabaseCloud(accessToken: string, geminiApiKey: string): Promise<number> {
  // 1. Pull the data from the network stream
  const rawEmails = await fetchLatestEmailContext(accessToken);
  if (rawEmails.length === 0) return 0;

  // 2. Map structural telemetry using Gemini instead of Groq
  const extractedTasks = await analyzeEmailsWithGemini(rawEmails, geminiApiKey);
  if (extractedTasks.length === 0) return 0;

  // 3. Batch insert directly into your live database & queue notifications
  let successfullyInserted = 0;
  for (const task of extractedTasks) {
    const { error } = await supabase.from('tasks').insert([
      {
        title: task.title,
        duration: task.duration.toString(),
        deadline: task.deadline,
        priority_score: 50,
      },
    ]);

    if (!error) {
      successfullyInserted++;
      
      // TRIGGER THE 3-TIER NOTIFICATION SCHEDULER IN REAL-TIME
      await scheduleTaskNotificationGrid({
        taskTitle: task.title,
        deadlineString: task.deadline,
        durationMinutes: task.duration
      });
    }
  }

  return successfullyInserted;
}