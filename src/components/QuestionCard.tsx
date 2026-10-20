function renderFormattedText(text: string) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|==.*?==|«.*?»|\[red\].*?\[\/red\]|\[blue\].*?\[\/blue\]|\[green\].*?\[\/green\]|\[purple\].*?\[\/purple\]|\[orange\].*?\[\/orange\]|\.\.\.\.\.\.)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-slate-950 underline decoration-amber-400 decoration-2">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-black">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith('[red]') && part.endsWith('[/red]')) {
      return (
        <span key={i} className="text-rose-600 font-black">
          {part.slice(5, -6)}
        </span>
      );
    }
    if (part.startsWith('[blue]') && part.endsWith('[/blue]')) {
      return (
        <span key={i} className="text-blue-600 font-black">
          {part.slice(6, -7)}
        </span>
      );
    }
    if (part.startsWith('[green]') && part.endsWith('[/green]')) {
      return (
        <span key={i} className="text-emerald-600 font-black">
          {part.slice(7, -8)}
        </span>
      );
    }
    if (part.startsWith('[purple]') && part.endsWith('[/purple]')) {
      return (
        <span key={i} className="text-purple-600 font-black">
          {part.slice(8, -9)}
        </span>
      );
    }
    if (part.startsWith('[orange]') && part.endsWith('[/orange]')) {
      return (
        <span key={i} className="text-amber-600 font-black">
          {part.slice(8, -9)}
        </span>
      );
    }
    if (part.startsWith('«') && part.endsWith('»')) {
      return (
        <span key={i} className="text-emerald-800 font-bold font-serif">
          {part}
        </span>
      );
    }
    if (part === '......') {
      return (
        <span
          key={i}
          className="inline-block px-3 mx-1 font-mono font-black text-amber-600 bg-amber-50 border-b-2 border-dashed border-amber-500"
        >
          ......
        </span>
      );
    }
    return part;
  });
}
