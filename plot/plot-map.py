from graphviz import Digraph

dot = Digraph("SmartRide_Map_Module", format="png")
dot.attr(rankdir="TB", fontsize="14")

# High-level features
dot.node("Plan", "🧭 features/maps/plan", shape="box", style="filled", fillcolor="#CDE8FF")
dot.node("Nav", "🚴 features/maps/nav", shape="box", style="filled", fillcolor="#FFE9B1")
dot.node("Controller", "🎛️ controller.ts", shape="box", style="filled", fillcolor="#D9EBCF")

# Shared internals
for name in ["store.ts", "state.ts", "operations/"]:
    dot.node(name, name, shape="note", style="filled", fillcolor="#E6E6E6")

# Connect plan/nav to store/state/ops
for feature in ["Plan", "Nav"]:
    dot.edge(feature, "store.ts")
    dot.edge(feature, "state.ts")
    dot.edge(feature, "operations/")

# Controller connects to state
dot.edge("Controller", "state.ts")
dot.edge("Controller", "store.ts")

# Map components
dot.node("MapView", "🗺️ MapView.tsx", shape="component", style="filled", fillcolor="#F5C6EC")
dot.node("MapWrapper", "📦 MapWrapper.tsx", shape="component", style="filled", fillcolor="#F5C6EC")
dot.node("Widgets", "🎯 widgets/visuals + interaction", shape="component", style="filled", fillcolor="#F5C6EC")

dot.edge("Controller", "MapWrapper")
dot.edge("MapWrapper", "MapView")
dot.edge("MapView", "Widgets")

# Pages
dot.node("RoutePlanningPage", "📝 RoutePlanningPage.tsx", shape="oval", style="filled", fillcolor="#FFFACD")
dot.node("NavigationPage", "🚦 NavigationPage.tsx", shape="oval", style="filled", fillcolor="#FFFACD")

dot.edge("RoutePlanningPage", "Controller")
dot.edge("NavigationPage", "Controller")
dot.edge("RoutePlanningPage", "MapWrapper")
dot.edge("NavigationPage", "MapWrapper")

# Export and render
dot.render("map_architecture", view=True)
