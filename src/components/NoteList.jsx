import React from 'react';
import PropTypes from 'prop-types';
import NoteItem from './NoteItem';
import Typography from '@mui/material/Typography';

// Impor motion dan AnimatePresence dari Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Varian untuk container list (untuk stagger)
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Setiap anak akan dianimasikan dengan jeda 0.1s
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

function NoteList({ notes, onDelete, onArchive, onUnarchive, listType }) {
  if (!notes || notes.length === 0) {
    return (
      <Typography
        // className="notes-list__empty-message" // Hapus jika tidak ada styling khusus lagi
        sx={{
          textAlign: 'center',
          paddingY: 5,
          color: 'text.secondary',
          marginTop: 2,
        }}
      >
        {listType === 'active' ? 'Tidak ada catatan aktif.' : 'Arsip kosong.'}
      </Typography>
    );
  }

  return (
    // motion.div untuk animasi container
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      // className="notes-list" // Anda bisa mengembalikan kelas ini jika ada styling spesifik untuk list vertikal
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} // Mengatur tumpukan vertikal dengan jarak
    >
      <AnimatePresence>
        {notes.map((note) => (
          // Tidak perlu Grid item, NoteItem langsung di-render
          // Key dipindahkan ke NoteItem jika NoteItem adalah komponen motion langsung
          // Jika NoteItem membungkus motion component, key bisa di NoteItem atau wrapper terluarnya.
          // Untuk konsistensi dengan contoh sebelumnya, kita anggap NoteItem adalah komponen yang siap dianimasikan.
          <NoteItem
            key={note.id} // Pastikan key ada di elemen terluar dalam map jika NoteItem bukan motion component
            note={note}
            onDelete={onDelete}
            onArchive={listType === 'active' ? onArchive : undefined}
            onUnarchive={listType === 'archived' ? onUnarchive : undefined}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

const noteShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
});

NoteList.propTypes = {
  notes: PropTypes.arrayOf(noteShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
  listType: PropTypes.oneOf(['active', 'archived']).isRequired,
};

export default NoteList;
