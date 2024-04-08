const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { google } = require("googleapis");

// Use body-parser middleware to parse JSON bodies
const jsonParser = bodyParser.json();

// Define your endpoint handler function
const handleSubscribeRequest = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const GOOGLE_SHEET_ID = "1Jxtsu-Mksm4rlg7N3-ZkEytw8WGyXaLOD3AOD4ief40";
  const GOOGLE_CLIENT_EMAIL =
    "180816147719-compute@developer.gserviceaccount.com";
  const GOOGLE_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD5vSt37/EZWWgI\nuiCXNTHFgDtdvsJzZX37e4jHo61v8KdGh9cLoAP1NaLiATZPVSdX2JEq4WPdBWt9\nhernj1lMdjCOAbW8s8OS1WiggsXVIXxeV0tdzzDFfeFKNU5O7VTVwHls89jbQdCT\nnDI/Ju1tsU1hkmShNdy8XvgXvkkyPyBBzQVZrrvERkv0qQpRzE7fpCRCwKhaA5Z0\nHQwda7+rrOKZJW7Vv53lvV9S1kS/AE1hLU7gCJrV94eu4dDRXYMHgi3vRWFWNgwM\nUDqUd1XRbpSR7ZF4bImeXApaIzeHA13p6uyASreQOGCmrmmjCKGY6V8n+0JdhMEn\nKI6KujRhAgMBAAECggEAA4MHvLQc0j6vMhTjTEUKT2JDfh4RMBwQrAvmFeqaZS0q\nPllpf9IZpCXY2xqUbS6qcuI1KQ101kuTIfd+C2YOZdRxT9nnI0FtjLUgDMZx/5KC\nOXW69gApydPV6nF6nwJYM6Of1tVMqslPjyJ+lA6ZKaD5Oy1FaX1EqUh2RCff8csp\nguKpAY7OqKa1z8FrogBiIgKk/ZC/lXRkFhkxej5xp+UML5a2Jq6SLlAscm3vKgiC\n9ULpO4EYfBtqPsnrbEvG9PI/WNQAooL7aN612YlRg4TBd21IfPYxfD7XLhYk13BH\n5AgvY3bp35PxrR36HQmosoQFcHwhvEssa/0gPARQTQKBgQD9az3ou57tRImUx+FK\nuzhapOawbXh+yXe4J6n7Z7TZ793oflz+ypkdQMOIWjSiYM2YJec+DY9I/xcx/GCR\nP3e/TAq7iNvFyaKaawuceHxzw/pv1IbZV/TW4dVpMcuN/sx8Nk+Ov1vfwPm4aCOG\n0AuYAP5bdvV2c2bPNSA/kXNOlQKBgQD8SFU5ZmUeTbnyswwFeOWhkoMGd6A5bzgs\nxnUUzSmgWxtSWvqyL3puV8rwGuau/jLNjed1kKn7I1FLYsgd4AmqzwRFTw0X1HFk\nGyKTEX5Ik5ge2w39wldlwuTRjvCCUZKqtNANIcWpEzCyjTSAQOQ/3+VJOmO93GRZ\nd5AysV03nQKBgDvfppTiHz53vvnD79q0OTBRXZ+5fYqXFw4PcP3RFs2W+pr/oAEi\n5OIgdxI0HdNvg6O68NOcaIoamuRYeIhYsnYkBTUhtKsaZKyPNgMWBHFlkDnzwJiB\nS3uph75+4VT/Klj+i/VyCMbo1RdYo2wqo1KaiX4asQv3YAb8yk26k7+xAoGAPQx3\n6xr3Lz0Z2TwwlYZq8w1UPZVnJV7flh40KON4xkAlvWkcr0/D7b268x1fY0tKGenT\n7+Qg7g/e1UJDMM+NJ1NPMkJt5a1X/yR92l7qUz+8GQNjQFvt8EcYPgm7850vw7Vb\nf0ID5eUp7Js08DBDy50vi+fgSQpzEh9Xupym9RUCgYBgwn8IgH9WGKQTTt833Gby\nebm2f40HFgOAjPPVCSfQQDgwo8yA+sjm5fhPegoDxwTlav22UDR4kiV7Eo6kr8kr\nDMlkaCwwWk0VVJPJcx5nNNxcY1WmYygS1oi2koWpS0DWB4fsC2aOM1iOh0YmJclX\nOy3F8jjW7OhkZYFfJIs1rA==\n-----END PRIVATE KEY-----\n";

  const body = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "A1:C1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[body.fullName, body.email, body.company]],
      },
    });

    return res.status(201).json({ data: response.data });
  } catch (e) {
    console.error("Error:", e);
    console.error("Error Message:", e.message);
    return res.status(500).json({ message: e.message });
  }
};

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.post("/googlesheets", jsonParser, handleSubscribeRequest);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});