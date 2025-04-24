export const documentHtmlTemplate = (content: string, title?: string) =>
  `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${title ? `<title>${title}</title>` : ""}
            <style>
            </style>
        </head>
        <body>
            <div id="content">${content}</div>
        </body>
    </html>
`;
