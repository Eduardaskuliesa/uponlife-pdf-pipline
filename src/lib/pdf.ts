export async function generatePdf(html: string): Promise<ArrayBuffer> {
  const formData = new FormData();
   formData.append(
    "files",
    new Blob([html], { type: "text/html; charset=utf-8" }),
    "index.html"
  );
  formData.append("printBackground", "true");
  formData.append("preferCssPageSize", "true");
  formData.append("scale", "1");

  const response = await fetch(
    "http://localhost:3000/forms/chromium/convert/html",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.arrayBuffer();
}


