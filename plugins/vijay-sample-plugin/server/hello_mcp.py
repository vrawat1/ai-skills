from mcp.server.fastmcp import FastMCP

server =  FastMCP("hello-mcp")

@server.tool()
def greet(name: str) -> dict:
    return {"message": f"Hello, {name}!"}

@server.tool()
def add(a: int, b: int) -> dict:
    return {"result": a + b}

if __name__ == "__main__":
    server.run(transport="stdio")