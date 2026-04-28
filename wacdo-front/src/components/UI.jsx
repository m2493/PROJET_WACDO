export function Card({title,children})
{return <section className="bg-white rounded-2xl border shadow-sm p-6">
    {title&&<h2 className="text-2xl font-bold mb-4">{title}</h2>}{children}</section>}
export function Button({children})
{return <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium">{children}</button>}
export function Input({label,placeholder})
{return <div><label className="block text-sm font-medium mb-2">{label}</label>
<input placeholder={placeholder} className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"/></div>}
