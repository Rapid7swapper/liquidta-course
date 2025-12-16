"""
Example script using the Anthropic Claude API
Make sure to set your ANTHROPIC_API_KEY environment variable before running.
"""

from anthropic import Anthropic

# Initialize the client
# The API key will be read from the ANTHROPIC_API_KEY environment variable
# You can also pass it directly: client = Anthropic(api_key="your-api-key-here")
client = Anthropic()

# Example: Send a message to Claude
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude! Can you help me with coding?"}
    ]
)

print(message.content[0].text)

