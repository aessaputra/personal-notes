import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Oops! Sepertinya halaman yang Anda cari tidak ada.</p>
      <p>
        <Link to="/" className="action">Kembali ke Beranda</Link>
      </p>
    </section>
  );
}

export default NotFoundPage;