export default function UnauthorizedPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Access denied</h1>
      <p className="mt-4">You are not authorized to connect.</p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.5rem 1.2rem',
          backgroundColor: 'gray',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        back to home
      </a>
    </div>
  );
}
