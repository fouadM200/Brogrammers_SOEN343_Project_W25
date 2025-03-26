const { sendPromotionalEmail } = require("./email");

class EmailNotifier {
  async update(eventData) {
    const { newEvent, interestedUsers } = eventData;

    for (const user of interestedUsers) {
      const eventDate = new Date(newEvent.date).toDateString();

      const emailBody = `
Hi ${user.name},

A new event titled "${newEvent.title}" might match your interests!

📅 Date: ${eventDate}
🕒 Time: ${newEvent.startTime} - ${newEvent.endTime}
📍 Location: ${newEvent.location}
🎤 Speaker: ${newEvent.speaker}
📝 Description: ${newEvent.description}

Log in to your account to view more and register.

We hope to see you there!
`;

      await sendPromotionalEmail(
        user.email,
        "New Event That Might Interest You!",
        emailBody
      );
    }
  }
}

module.exports = EmailNotifier;
