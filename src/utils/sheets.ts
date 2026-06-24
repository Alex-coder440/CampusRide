export const logToSheet = async (sheetName: string, rowData: any[], updateKey?: string) => {
  try {
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetName, updateKey, data: rowData.map(d => String(d || '')) })
    });
  } catch (err) {
    console.error(`Failed to log to sheet ${sheetName}:`, err);
  }
};
