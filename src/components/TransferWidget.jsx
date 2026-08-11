// Static transfer widget preview — a dark card showing saved contact avatars,
// a read-only amount field and a "Transfer Now" button with morphing hover
// interactions. Presentational only; no live transfer logic.

// Saved contacts rendered as circular avatars. The first entry is shown as the
// selected recipient (accent ring). Images are Unsplash portrait crops.
const contacts = [
  {
    name: 'Ava Mitchell',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Liam Carter',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Sofia Nguyen',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Noah Bennett',
    image:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Mia Rodriguez',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  },
];

export default function TransferWidget() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
      <p className="text-sm text-gray-400 mb-4">Send to</p>

      <div className="flex flex-row gap-3">
        {contacts.map((contact, index) => (
          <img
            key={contact.name}
            src={contact.image}
            alt={contact.name}
            loading="lazy"
            aria-label={
              index === 0
                ? `${contact.name}, selected recipient`
                : `Send to ${contact.name}`
            }
            className={`w-12 h-12 rounded-full object-cover ${
              index === 0 ? 'border-2 border-accent' : ''
            }`}
          />
        ))}
      </div>

      <div className="mt-8">
        <label
          htmlFor="transfer-amount"
          className="block text-sm text-gray-400 mb-2"
        >
          Amount
        </label>
        <input
          id="transfer-amount"
          type="text"
          value="$3.25"
          readOnly
          aria-label="Transfer amount, 3 dollars and 25 cents"
          className="text-3xl font-mono font-bold bg-transparent border-none focus:outline-none text-white w-full"
        />
      </div>

      <button
        type="button"
        aria-label="Transfer now"
        className="mt-8 bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-accent/25 hover:bg-accent/90 transition-all duration-200"
      >
        Transfer Now
      </button>
    </div>
  );
}
