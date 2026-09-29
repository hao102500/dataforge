export default function CommandStatus({
  saved = true,
  throughput = "86,400 rec/s",
}) {
  return (
    <div className="df-command-status">
      {saved && <span className="df-saved">Saved</span>}

      <span className="df-throughput">{throughput}</span>
    </div>

  );
}
