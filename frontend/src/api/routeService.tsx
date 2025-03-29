// src/api/routeService.js
  export async function getRoute(start, dest) {
    const url = "http://127.0.0.1:5000/api/get_route";
    const payload = { start, dest };
  
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  }
  