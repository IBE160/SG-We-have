from pydantic_ai import Agent
import inspect

print("Return annotation of run:")
print(inspect.signature(Agent.run).return_annotation)
