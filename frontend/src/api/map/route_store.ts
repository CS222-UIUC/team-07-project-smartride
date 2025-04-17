export interface Route {
  id: number;
  route_name: string;
}

export async function getSavedRoutes(): Promise<Route[]> {
  try {
    const response = await fetch("/api/get_routes", {
      method: "GET",
      credentials: "include",
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: Route[];
      error?: string;
    };
    if (result.success) {
      return result.data ?? [];
    } else {
      console.error("Failed to fetch routes", result.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching routes", error);
    return [];
  }
}

export async function createOrUpdateRoute(
  routeId: number,
  routeName: string,
  routeData: object,
): Promise<Route | null> {
  try {
    const body = { id: routeId, route_name: routeName, route_data: routeData };
    const response = await fetch("/api/manage_route", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: Route;
      error?: string;
    };
    if (result.success) {
      return result.data ?? null;
    } else {
      console.log(result);
      return null;
    }
  } catch (error) {
    console.error("Error saving route", error);
    return null;
  }
}
