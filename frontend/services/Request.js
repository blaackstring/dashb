import { InferenceClient } from "@huggingface/inference";


export const SendingRequest = async ( data ) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that provides insights based on the provided data.",
      },
      {
        role: "user",
        content: `Analyze the following data and provide insights at once not in point and a overall summary:\n\n${JSON.stringify(data, null, 2).slice(0, 1000)}`,
      },
    ];

    
  const chatCompletion = await new InferenceClient(import.meta.env.VITE_HF_TOKEN || "").chatCompletion({
  model: "meta-llama/Meta-Llama-3-8B-Instruct",
  messages: messages,
});

    const reply = chatCompletion.choices[0].message;
    console.log("Assistant raw reply:", reply);

    const formattedReply = {
      role: "assistant",
      content: String(reply?.content || reply?.text || JSON.stringify(reply))
    };

    console.log("Formatted reply:", formattedReply);
    return formattedReply;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    throw error;
  }
};
