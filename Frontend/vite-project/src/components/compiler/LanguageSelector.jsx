export default function LanguageSelector({
  language,
  onChange,
}) {

  return (

    <select
      value={language}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        w-[170px]
        rounded-lg
        border
        border-[#30363d]
        bg-[#161b22]
        px-3
        py-2
        text-white
        outline-none
        transition
        focus:border-[#58a6ff]
        focus:ring-1
        focus:ring-[#58a6ff]
      "
    >

      <option
        className="bg-[#161b22]"
        value="c++"
      >
        C++
      </option>

      <option
        className="bg-[#161b22]"
        value="java"
      >
        Java
      </option>

      <option
        className="bg-[#161b22]"
        value="javascript"
      >
        JavaScript
      </option>

    </select>

  );
}