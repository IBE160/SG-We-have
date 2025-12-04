from pydantic_ai.result import AgentRunResult
import inspect

print(inspect.signature(AgentRunResult.__init__))
print(dir(AgentRunResult))
