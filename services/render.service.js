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
  // Normalize line endings (Windows \r\n to standard \n) and convert to HTML breaks
  const safeBody = String(body || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, "<br/>");

  // Using a simple table layout ensures maximum compatibility across all email clients.
  // Explicit text-align: left and standard fonts prevent it from looking like an automated system alert.
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
          <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: #222222; text-align: left; max-width: 600px; margin: 0 auto; padding: 0 20px; white-space: pre-wrap;">
            ${safeBody}
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
