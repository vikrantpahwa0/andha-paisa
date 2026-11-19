/**
 * Supports both {variable} and {{variable}} syntax.
 */
const TOKEN_REGEX = /\{+\s*([a-zA-Z_][a-zA-Z0-9_.-]*)\s*\}+/g;

export const extractVariables = (...texts) => {
  const found = new Set();
  texts.forEach((text) => {
    if (!text) return;
    for (const match of text.matchAll(TOKEN_REGEX)) {
      found.add(match[1]);
    }
  });
  return [...found];
};

export const renderTemplate = (text, variables = {}) => {
  if (!text) return "";
  return text.replace(TOKEN_REGEX, (match, key) => {
    const value = variables?.[key];
    if (value === undefined || value === null || value === "") return match;
    return String(value);
  });
};

export const buildHtml = (body) => {
  if (!body) return "";

  // 1. Normalize line endings and TRIM leading/trailing spaces
  // This removes the accidental indentation on "Hi Nandini,"
  const normalized = String(body).replace(/\r\n/g, "\n").trim();

  // 2. Split by double newlines to create paragraphs
  const formattedBody = normalized
    .split(/\n{2,}/)
    .map((paragraph) => {
      // Convert single newlines within the paragraph to <br>
      const withBreaks = paragraph.replace(/\n/g, "<br>");
      // Return a <p> tag with explicit margin resets (fixes huge Gmail gaps)
      return `<p style="margin: 0 0 16px 0; padding: 0;">${withBreaks}</p>`;
    })
    .join("");

  // 3. Return the robust email wrapper
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
      <tr>
        <td align="left" style="padding: 20px 0;">
          <!-- Notice how ${formattedBody} is flush against the tags to prevent space rendering -->
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.5; color: #222222; text-align: left; max-width: 600px; margin: 0 auto; padding: 0 20px;">${formattedBody}</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
