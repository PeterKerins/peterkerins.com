import type { NextApiRequest, NextApiResponse } from "next";
import mail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  throw new Error("SENDGRID API KEY NOT FOUND");
}

const contact = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);

  const message = `
    Name: ${body.name}\r\n
    Email: ${body.email}\r\n
    Message: ${body.message}
  `;
  const data = {
    to: "hello@peterkerins.com",
    from: "hello@peterkerins.com",
    subject: `New message from ${body.name}`,
    text: message,
    html: message.replace(/\r\n/g, "<br />"),
  };

  (async () => {
    try {
      await mail.send(data);
      console.log("Email sent");
      res.status(200).json({ status: "OK" });
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
        res.status(500).json({ status: error.response.body });
      }
    }
  })();
};

export default contact;
