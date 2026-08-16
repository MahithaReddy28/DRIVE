import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.graph.engine import graph_engine

def test_graph_initialization():
    stats = graph_engine.get_stats()
    assert stats["nodes_count"] > 0
    assert stats["edges_count"] > 0
    print(f"Graph initialized with {stats['nodes_count']} nodes and {stats['edges_count']} edges.")

def test_route_calculation():
    # Calculate route from Relief Center Alpha to Central Hospital
    orig = graph_engine.nodes_data["N_PERAMBUR"]
    dest = graph_engine.nodes_data["N_CENTRAL"]
    
    path_nodes, segments, meta = graph_engine.calculate_route(
        orig["lat"], orig["lng"], dest["lat"], dest["lng"], mode="safety"
    )
    
    assert len(path_nodes) > 1
    assert meta["distance_km"] > 0
    assert meta["recompute_ms"] > 0
    print(f"Route calculated successfully: {meta['distance_km']} km in {meta['recompute_ms']} ms.")

if __name__ == "__main__":
    test_graph_initialization()
    test_route_calculation()
    print("ALL BACKEND TESTS PASSED!")
