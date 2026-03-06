#!/usr/bin/env node
/**
 * Test script per il login ERP.
 * Uso: API_URL=https://tuo-backend.onrender.com node scripts/test-login.js
 * Oppure: node scripts/test-login.js https://tuo-backend.onrender.com
 */
const API_URL = process.env.API_URL || process.argv[2] || "http://localhost:3000";

async function testLogin() {
  console.log(`\n🧪 Test login su ${API_URL}\n`);
  console.log("Credenziali: admin@erp.local / admin123\n");

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@erp.local", password: "admin123" }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.access_token && data.user) {
      console.log("✅ Login OK!");
      console.log("   Token:", data.access_token?.slice(0, 20) + "...");
      console.log("   User:", data.user?.email, "-", data.user?.role);
      process.exit(0);
    }

    if (res.status === 401) {
      console.log("❌ Credenziali non valide (401)");
      console.log("   Possibili cause:");
      console.log("   - Lo seed non è stato eseguito sul database");
      console.log("   - Email o password errate");
      console.log("   Messaggio:", data?.message || data?.error || "");
      process.exit(1);
    }

    console.log(`❌ Errore ${res.status}`);
    console.log("   Risposta:", JSON.stringify(data, null, 2));
    process.exit(1);
  } catch (err) {
    console.log("❌ Errore di connessione:", err.message);
    console.log("   Verifica che l'URL sia corretto e il backend sia avviato.");
    process.exit(1);
  }
}

testLogin();
