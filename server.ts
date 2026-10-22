import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const portFlagIndex = args.indexOf('--port');
const cliPort = portFlagIndex !== -1 && args[portFlagIndex + 1] ? parseInt(args[portFlagIndex + 1], 10) : null;
const PORT = cliPort || (process.env.PORT === '3000' ? 3000 : 3000);

const app = express();

// Security Middleware: Set HTTP security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// JSON Body Parser with strict safe limits
app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI securely
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Input Sanitization helper
function sanitizeString(str: any, maxLen = 1000): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

// Chat endpoint with role instruction and model options
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash', userQuestion } = req.body || {};
    
    // Whitelist supported models
    const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview'];
    const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.5-flash';

    const systemInstruction = `You are Ustadh Sulaiman & Sister Mariam, the friendly and knowledgeable AI Admissions Counselor & Academic Guide for Shuhadae Islamic Secondary School, located in Nyamitanga Division, Mbarara City, Western Uganda (about 2 km off the Mbarara–Isingiro Highway).
Tone: Warm, respectful, values-driven, academic, encouraging, and culturally familiar with Ugandan education (UNEB, PLE, UCE, UACE, Division 1, Aggregates, UGX shillings, Day & Boarding).
Key details to know:
- Location: Nyamitanga Division, Mbarara City, Western Uganda (2 km off Mbarara–Isingiro Highway).
- Phone: 0705 705 967 | Alumni: 0702 365 176 / 0755 260 894 | Email: info@shuhadaeislamicssmbarara.com
- Offerings: O-Level (New Lower Secondary Curriculum S.1 - S.4) and A-Level (S.5 - S.6 Arts & Sciences combinations: PCB, BCM, PEM, PCM, HEG, DEG, HEL, MEA, etc.).
- Boarding & Day: Modern separate boys & girls hostels with 24/7 security, matrons & wardens, wholesome halal meals.
- Spiritual Environment: 5 daily congregational prayers in school mosque, Tahfiz (Quran memorization) program, Hadith & Tarbiyyah sessions, Friday Juma'at prayer.
- Fees estimate: O-Level Boarding: UGX 950,000 / term; Day: UGX 520,000 / term. A-Level Boarding: UGX 1,050,000 / term; Day: UGX 580,000 / term. Flexible payment schedules via Centenary Bank, Stanbic, DFCU, and MTN/Airtel School Pay.
- Top ranked among Islamic and secular secondary institutions in Mbarara District and Ankole sub-region with consistently high UNEB first grades.
Always provide clear, helpful, respectful answers. Use Islamic greetings (Assalamu Alaikum) when appropriate.`;

    if (!apiKey) {
      return res.json({
        reply: `Assalamu Alaikum! Welcome to Shuhadae Islamic Secondary School, Nyamitanga, Mbarara City. I am your Virtual Admissions Assistant. How may I assist you with our O-Level, A-Level, boarding facilities, or term fees today? You can also reach the bursar and admissions desk directly on 0705 705 967 or via WhatsApp.`
      });
    }

    // Prepare contents with bounded array size and length
    const contents: any[] = [];
    if (Array.isArray(messages) && messages.length > 0) {
      const sanitizedMessages = messages.slice(-10); // Keep last 10 messages for memory bound
      for (const m of sanitizedMessages) {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: sanitizeString(m.content || m.text || '', 800) }]
        });
      }
    } else if (userQuestion) {
      contents.push({
        role: 'user',
        parts: [{ text: sanitizeString(userQuestion, 800) }]
      });
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello, please introduce Shuhadae Islamic Secondary School and how to apply.' }]
      });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        temperature: 0.7,
      }
    });

    res.json({
      reply: response.text || "Thank you for reaching out to Shuhadae Islamic Secondary School. Please contact our office on 0705 705 967 for further details.",
      modelUsed: selectedModel
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(200).json({
      reply: 'Assalamu Alaikum. Shuhadae Islamic Secondary School admissions for S.1 and S.5 are open. Please contact us on 0705 705 967 or visit our campus in Nyamitanga, Mbarara City.',
      isFallback: true
    });
  }
});

// Text-to-Speech endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Puck' } = req.body || {};
    const sanitizedText = sanitizeString(text, 600);
    if (!sanitizedText) {
      return res.status(400).json({ error: 'Valid text is required for speech synthesis' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const allowedVoices = ['Puck', 'Kore', 'Fenrir', 'Aoede'];
    const selectedVoice = allowedVoices.includes(voice) ? voice : 'Puck';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: sanitizedText }]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Speech synthesis did not return audio' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'Speech synthesis service unavailable' });
  }
});

// High-quality Image Generation endpoint using gemini-3-pro-image-preview with 1K, 2K, 4K affordance
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '16:9' } = req.body || {};
    const sanitizedPrompt = sanitizeString(prompt, 500);
    if (!sanitizedPrompt) {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const validRatios = ['16:9', '4:3', '1:1', '3:4', '9:16'];
    const selectedRatio = validRatios.includes(aspectRatio) ? aspectRatio : '16:9';

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `High quality photograph for Shuhadae Islamic Secondary School, Mbarara Uganda: ${sanitizedPrompt}. Professional lighting, authentic African school setting, clean emerald and gold architectural details.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: selectedRatio as any,
          imageSize: selectedSize as any
        }
      }
    });

    let imageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image was generated' });
    }

    res.json({
      imageUrl,
      imageSize: selectedSize,
      aspectRatio: selectedRatio
    });
  } catch (err: any) {
    console.error('Image Generation error:', err);
    res.status(500).json({ error: 'Image generation service temporarily unavailable' });
  }
});

// Download Standalone index.html endpoint
app.get('/download/index.html', (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'shuhadae-standalone-offline.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="index.html"');
  res.sendFile(filePath);
});

app.get('/api/download-index', (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'shuhadae-standalone-offline.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="index.html"');
  res.sendFile(filePath);
});

// -------------------------------------------------------------
// -------------------------------------------------------------
// Admin Accounts System (Multi-Admin Supported with No Limit)
// -------------------------------------------------------------
const MAX_ADMIN_ACCOUNTS = 999;
const ADMIN_STORAGE_PATH = path.resolve(__dirname, 'admin_records.json');
const MASTER_SECURITY_PASSCODE = 'SHUHADAE-OWNER-2026';

interface AdminRecord {
  id: string;
  username: string;
  fullName: string;
  title: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt: string;
  isPrimary: boolean;
}

const OWNER_ADMIN: AdminRecord = {
  id: 'adm_owner_primary',
  username: 'alanwalkr',
  fullName: 'Alan Walker',
  title: 'Platform Owner & Head of Administration',
  email: 'alanwalkr83@gmail.com',
  phone: '0705 705 967',
  password: 'alanwalkr2026!',
  createdAt: '2026-01-01T00:00:00Z',
  isPrimary: true,
};

function getSavedAdmins(): AdminRecord[] {
  try {
    if (fs.existsSync(ADMIN_STORAGE_PATH)) {
      const content = fs.readFileSync(ADMIN_STORAGE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        if (!data.some((a) => a.username.toLowerCase() === 'alanwalkr' || a.email?.toLowerCase() === 'alanwalkr83@gmail.com')) {
          const merged = [OWNER_ADMIN, ...data];
          persistAdmins(merged);
          return merged;
        }
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading admin records:', err);
  }
  persistAdmins([OWNER_ADMIN]);
  return [OWNER_ADMIN];
}

function persistAdmins(admins: AdminRecord[]): void {
  try {
    fs.writeFileSync(ADMIN_STORAGE_PATH, JSON.stringify(admins, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin records:', err);
  }
}

// Get Admin Status & Capacity
app.get('/api/admin/status', (req, res) => {
  const admins = getSavedAdmins();
  res.json({
    count: admins.length,
    max: MAX_ADMIN_ACCOUNTS,
    canAdd: true,
    ownerEmail: 'alanwalkr83@gmail.com',
    ownerUsername: 'alanwalkr',
    publicSelfRegistrationEnabled: false,
    admins: admins.map(({ id, username, fullName, title, email, phone, createdAt, isPrimary }) => ({
      id,
      username,
      fullName,
      title,
      email,
      phone,
      createdAt,
      isPrimary,
      isOwner: username.toLowerCase() === 'alanwalkr' || email?.toLowerCase() === 'alanwalkr83@gmail.com',
    })),
  });
});

// Create Admin Account (Protected by Master Security Passcode)
app.post('/api/admin/create', (req, res) => {
  try {
    const { username, fullName, title, email, phone, password, masterPasscode } = req.body || {};
    const authHeaderPasscode = req.headers['x-master-passcode'];

    // Enforce Master Security Passkey: Only the platform owner can provision admin accounts
    const providedPasscode = (masterPasscode || authHeaderPasscode || '').toString().trim();
    if (providedPasscode !== MASTER_SECURITY_PASSCODE) {
      return res.status(403).json({ 
        error: 'Forbidden: Admin account creation is restricted to the Platform Owner. Valid Master Security Passkey is required.',
        code: 'MASTER_PASSKEY_REQUIRED'
      });
    }

    const admins = getSavedAdmins();
    const cleanUsername = sanitizeString(username, 50).toLowerCase();
    const cleanFullName = sanitizeString(fullName, 100);
    const cleanTitle = sanitizeString(title, 100) || 'School Administrator';
    const cleanPhone = sanitizeString(phone, 30);
    const cleanEmail = sanitizeString(email, 100);
    const cleanPassword = sanitizeString(password, 100);

    if (!cleanUsername) {
      return res.status(400).json({ error: 'Username or Admin ID is required' });
    }
    if (!cleanFullName) {
      return res.status(400).json({ error: 'Admin full name is required' });
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return res.status(400).json({ error: 'Password or PIN must be at least 4 characters' });
    }

    if (admins.some((a) => a.username.toLowerCase() === cleanUsername)) {
      return res.status(409).json({ error: `An administrator with username "${cleanUsername}" is already registered` });
    }

    const newAdmin: AdminRecord = {
      id: `adm_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      username: cleanUsername,
      fullName: cleanFullName,
      title: cleanTitle,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword,
      createdAt: new Date().toISOString(),
      isPrimary: false,
    };

    admins.push(newAdmin);
    persistAdmins(admins);

    res.json({
      success: true,
      message: `Authorized administrator account for "${newAdmin.fullName}" created successfully.`,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        fullName: newAdmin.fullName,
        title: newAdmin.title,
        email: newAdmin.email,
        phone: newAdmin.phone,
        createdAt: newAdmin.createdAt,
        isPrimary: newAdmin.isPrimary,
      },
      capacity: {
        count: admins.length,
        max: MAX_ADMIN_ACCOUNTS,
        canAdd: true,
      },
    });
  } catch (err: any) {
    console.error('Error creating admin account:', err);
    res.status(500).json({ error: 'Failed to create administrator account' });
  }
});

// Admin Login Verification (Supports username or email: alanwalkr / alanwalkr83@gmail.com)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const cleanUsername = sanitizeString(username, 50).toLowerCase();
  const cleanPassword = sanitizeString(password, 100);

  const admins = getSavedAdmins();
  const admin = admins.find(
    (a) => a.username.toLowerCase() === cleanUsername || (a.email && a.email.toLowerCase() === cleanUsername)
  );

  if (!admin) {
    return res.status(401).json({ error: `Administrator "${cleanUsername}" not found or unauthorized.` });
  }

  if (admin.password && admin.password !== cleanPassword) {
    return res.status(401).json({ error: 'Incorrect administrator password or PIN.' });
  }

  res.json({
    success: true,
    admin: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      title: admin.title,
      email: admin.email,
      phone: admin.phone,
      createdAt: admin.createdAt,
      isPrimary: admin.isPrimary,
      isOwner: admin.username.toLowerCase() === 'alanwalkr' || admin.email?.toLowerCase() === 'alanwalkr83@gmail.com',
    },
  });
});

// Admin Storage Sync (Preserves Master Owner permanently)
app.post('/api/admin/sync', (req, res) => {
  try {
    const { admins } = req.body || {};
    if (Array.isArray(admins)) {
      const sanitized = admins.slice(0, MAX_ADMIN_ACCOUNTS);
      if (!sanitized.some((a) => a.username.toLowerCase() === 'alanwalkr' || a.email?.toLowerCase() === 'alanwalkr83@gmail.com')) {
        sanitized.unshift(OWNER_ADMIN);
      }
      persistAdmins(sanitized);
    }
    res.json({ success: true, count: getSavedAdmins().length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync admin accounts' });
  }
});

// Delete an Admin (Owner is protected and cannot be deleted)
app.post('/api/admin/delete', (req, res) => {
  try {
    const { adminId, masterPasscode } = req.body || {};
    const admins = getSavedAdmins();
    const target = admins.find((a) => a.id === adminId);
    if (!target) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    if (target.username.toLowerCase() === 'alanwalkr' || target.email?.toLowerCase() === 'alanwalkr83@gmail.com') {
      return res.status(403).json({ error: 'Forbidden: The Master Platform Owner account cannot be deleted.' });
    }

    const filtered = admins.filter((a) => a.id !== adminId);
    persistAdmins(filtered);

    res.json({
      success: true,
      message: `Admin account for ${target.fullName} revoked.`,
      count: filtered.length,
      max: MAX_ADMIN_ACCOUNTS,
      canAdd: filtered.length < MAX_ADMIN_ACCOUNTS,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove admin' });
  }
});

// Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shuhadae Islamic SS Server is running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
