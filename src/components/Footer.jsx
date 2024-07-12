export default function Footer() {
  return (
    <div>
      <hr className="border-t border-[#E9E9E9] mx-[30px]" /> {/* Divider */}
      <div className="flex flex-row">
        <div
          style={{
            textAlign: 'left',
            marginTop: '20px',
            paddingInline: '30px',
            marginBottom: '80px',
          }}
          className="text-[#9A9A9A]"
        >
          {new Date().getFullYear()} © VRMS Dashboard
        </div>
      </div>
    </div>
  );
}
