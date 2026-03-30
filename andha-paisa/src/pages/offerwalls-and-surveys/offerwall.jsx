function Offerwall() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b px-4 py-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 mr-3"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-green-600">Andha Paisa 💰</h1>
      </div>

      {/* Iframe */}
      <iframe
        src="https://reward-me.eu/aaf6f5fa-2ba4-11f1-8e50-4e5c1971bddc"
        sandbox="allow-top-navigation allow-scripts allow-same-origin allow-popups allow-forms"
        className="w-full h-[calc(100vh-64px)] border-none"
        title="Offerwall"
      />
    </div>
  );
}

export default Offerwall;
