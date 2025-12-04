import inspect
from pydantic_ai import Agent

print("Agent init signature:")
print(inspect.signature(Agent.__init__))

print("\nAgent run signature:")
print(inspect.signature(Agent.run))
