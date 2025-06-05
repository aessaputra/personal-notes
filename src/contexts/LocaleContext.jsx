import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

const LOCALE_STORAGE_KEY = 'appLocale';

const translations = {
  en: {
    appName: 'Personal Notes App',
    activeNotes: 'Active Notes',
    archivedNotes: 'Archived Notes',
    addNote: 'Add Note',
    searchPlaceholder: 'Search notes by title...',
    loginAs: 'Logged in as: {name}',
    logout: 'Logout',
    noActiveNotes: 'No active notes.',
    noArchivedNotes: 'Archive is empty.',
    deleteAction: 'Delete',
    archiveAction: 'Archive',
    unarchiveAction: 'Unarchive',
    confirmDeleteTitle: 'Are you sure?',
    confirmDeleteText: "Deleted notes can't be recovered!",
    confirmDeleteButton: 'Yes, delete it!',
    cancelButton: 'Cancel',
    deletedSuccessTitle: 'Deleted!',
    deletedSuccessText: 'Your note has been deleted.',
    archivedSuccessText: 'Note has been archived.',
    unarchivedSuccessText: 'Note has been unarchived.',
    addNoteSuccessText: 'New note has been added.',
    addNoteFailText: 'Failed to add note.',
    deleteNoteFailText: 'Failed to delete note.',
    archiveNoteFailText: 'Failed to archive note.',
    unarchiveNoteFailText: 'Failed to unarchive note.',
    registerTitle: 'Create New Account',
    loginTitle: 'Login to Notes App',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    passwordLabel: 'Password (min. 6 chars)',
    confirmPasswordLabel: 'Confirm Password',
    registerButton: 'Register',
    loginButton: 'Login',
    haveAccount: 'Already have an account? Login here',
    noAccount: "Don't have an account? Register here",
    passwordMismatch: 'Password and confirmation password do not match!',
    passwordMinLength: 'Password must be at least 6 characters!',
    registerSuccess: 'Registration successful! Please login.',
    registerFail: 'Registration failed: {message}',
    loginFail: 'Login failed: {message}',
    loadingNotes: 'Loading notes...',
    loadingSession: 'Verifying session...',
    loadingNoteDetail: 'Loading note detail...',
    pageNotFound: '404 - Page Not Found',
    pageNotFoundMessage: "Oops! The page you're looking for doesn't exist.",
    backToHome: 'Back to Home',
    newNoteTitle: 'Create New Note',
    noteTitlePlaceholder: 'Note title...',
    noteBodyPlaceholder: 'Write your note here...',
    createNoteButton: 'Create Note',
    titleCharLimit: 'Title characters remaining: {count}',
    noteDetailCreatedOn: 'Created on: {date}',
    themeToggleDark: 'Dark Mode',
    themeToggleLight: 'Light Mode',
    languageToggle: 'Switch Language',
    copyright: '© {year} Personal Notes App.',
    loginSuccessTitle: 'Login Successful!',
    logoutSuccessTitle: 'Logout Successful',
    logoutSuccessText: 'You have been successfully logged out.',
    addNoteSuccessTitle: 'Note Added!',
    deleteNoteSuccessTitle: 'Note Deleted!',
    deleteNoteSuccessText: 'The note has been successfully deleted.',
    archiveNoteSuccessTitle: 'Note Archived!',
    archiveNoteSuccessText: 'The note has been successfully archived.',
    unarchiveNoteSuccessTitle: 'Note Unarchived!',
    unarchiveNoteSuccessText: 'The note has been successfully unarchived.',
    failTitle: 'Operation Failed',
    oopsTitle: 'Oops...',
    fetchActiveNotesFail: 'Failed to fetch active notes: {message}',
    fetchArchivedNotesFail: 'Failed to fetch archived notes: {message}',
    fetchAllNotesFail: 'Failed to fetch all notes.',
    fetchAllNotesFailText: 'There was an error loading your notes. Please try again later.',
    addNoteFailTitle: 'Failed to Add Note',
    deleteNoteFailTitle: 'Failed to Delete Note',
    archiveNoteFailTitle: 'Failed to Archive Note',
    unarchiveNoteFailTitle: 'Failed to Unarchive Note',
    loginFailTitle: 'Login Failed',
    registerFailTitle: 'Registration Failed',
    successTitle: 'Success!',
    validationWarningTitle: 'Validation Warning',
    emptyNoteWarning: 'Note title and body cannot be empty.',
    untitledNote: 'Untitled Note',
    noNoteBody: 'This note has no content.',
    backButtonTooltip: 'Back to previous page',
    deletingText: 'Deleting...',
    processingText: 'Memproses...',
  },
  id: {
    appName: 'Aplikasi Catatan Pribadi',
    activeNotes: 'Catatan Aktif',
    archivedNotes: 'Catatan Terarsip',
    addNote: 'Tambah Catatan',
    searchPlaceholder: 'Cari catatan berdasarkan judul...',
    loginAs: 'Login sebagai: {name}',
    logout: 'Logout',
    noActiveNotes: 'Tidak ada catatan aktif.',
    noArchivedNotes: 'Arsip kosong.',
    deleteAction: 'Hapus',
    archiveAction: 'Arsipkan',
    unarchiveAction: 'Aktifkan',
    confirmDeleteTitle: 'Apakah Anda yakin?',
    confirmDeleteText: 'Catatan yang dihapus tidak dapat dikembalikan!',
    confirmDeleteButton: 'Ya, hapus!',
    cancelButton: 'Batal',
    deletedSuccessTitle: 'Dihapus!',
    deletedSuccessText: 'Catatan Anda telah dihapus.',
    archivedSuccessText: 'Catatan telah diarsipkan.',
    unarchivedSuccessText: 'Catatan telah diaktifkan.',
    addNoteSuccessText: 'Catatan baru telah ditambahkan.',
    addNoteFailText: 'Gagal menambahkan catatan.',
    deleteNoteFailText: 'Gagal menghapus catatan.',
    archiveNoteFailText: 'Gagal mengarsipkan catatan.',
    unarchiveNoteFailText: 'Gagal mengaktifkan catatan.',
    registerTitle: 'Buat Akun Baru',
    loginTitle: 'Login Aplikasi Catatan',
    nameLabel: 'Nama Lengkap',
    emailLabel: 'Alamat Email',
    passwordLabel: 'Password (min. 6 karakter)',
    confirmPasswordLabel: 'Konfirmasi Password',
    registerButton: 'Registrasi',
    loginButton: 'Login',
    haveAccount: 'Sudah punya akun? Login di sini',
    noAccount: 'Belum punya akun? Registrasi di sini',
    passwordMismatch: 'Password dan konfirmasi password tidak cocok!',
    passwordMinLength: 'Password minimal harus 6 karakter!',
    registerSuccess: 'Registrasi berhasil! Silakan login.',
    registerFail: 'Registrasi gagal: {message}',
    loginFail: 'Login gagal: {message}',
    loadingNotes: 'Memuat catatan...',
    loadingSession: 'Memverifikasi sesi...',
    loadingNoteDetail: 'Memuat detail catatan...',
    pageNotFound: '404 - Halaman Tidak Ditemukan',
    pageNotFoundMessage: 'Oops! Halaman yang Anda cari tidak ada.',
    backToHome: 'Kembali ke Beranda',
    newNoteTitle: 'Buat Catatan Baru',
    noteTitlePlaceholder: 'Judul catatan...',
    noteBodyPlaceholder: 'Tuliskan catatanmu di sini...',
    createNoteButton: 'Buat Catatan',
    titleCharLimit: 'Sisa karakter judul: {count}',
    noteDetailCreatedOn: 'Dibuat pada: {date}',
    themeToggleDark: 'Mode Gelap',
    themeToggleLight: 'Mode Terang',
    languageToggle: 'Ganti Bahasa',
    copyright: '© {year} Aplikasi Catatan Pribadi.',
    loginSuccessTitle: 'Login Berhasil!',
    logoutSuccessTitle: 'Logout Berhasil',
    logoutSuccessText: 'Anda telah berhasil logout.',
    addNoteSuccessTitle: 'Catatan Ditambahkan!',
    deleteNoteSuccessTitle: 'Catatan Dihapus!',
    deleteNoteSuccessText: 'Catatan telah berhasil dihapus.',
    archiveNoteSuccessTitle: 'Catatan Diarsipkan!',
    archiveNoteSuccessText: 'Catatan telah berhasil diarsipkan.',
    unarchiveNoteSuccessTitle: 'Catatan Diaktifkan!',
    unarchiveNoteSuccessText: 'Catatan telah berhasil diaktifkan dari arsip.',
    failTitle: 'Operasi Gagal',
    oopsTitle: 'Oops...',
    fetchActiveNotesFail: 'Gagal mengambil catatan aktif: {message}',
    fetchArchivedNotesFail: 'Gagal mengambil catatan arsip: {message}',
    fetchAllNotesFail: 'Gagal mengambil semua catatan.',
    fetchAllNotesFailText: 'Terjadi kesalahan saat memuat catatan Anda. Silakan coba lagi nanti.',
    addNoteFailTitle: 'Gagal Menambah Catatan',
    deleteNoteFailTitle: 'Gagal Menghapus Catatan',
    archiveNoteFailTitle: 'Gagal Mengarsipkan Catatan',
    unarchiveNoteFailTitle: 'Gagal Mengaktifkan Catatan',
    loginFailTitle: 'Login Gagal',
    registerFailTitle: 'Registrasi Gagal',
    successTitle: 'Berhasil!',
    validationWarningTitle: 'Peringatan Validasi',
    emptyNoteWarning: 'Judul dan isi catatan tidak boleh kosong.',
    untitledNote: 'Catatan Tanpa Judul',
    noNoteBody: 'Catatan ini tidak memiliki isi.',
    backButtonTooltip: 'Kembali ke halaman sebelumnya',
    deletingText: 'Menghapus...',
    processingText: 'Memproses...',
  },
};

const LocaleContext = createContext(null);

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }) {
  const getInitialLocale = () => {
    try {
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
      return storedLocale === 'en' ? 'en' : 'id';
    } catch (error) {
      console.error('Could not access localStorage for locale:', error);
      return 'id';
    }
  };

  const [locale, setLocale] = useState(getInitialLocale);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    } catch (error) {
      console.error('Could not save locale to localStorage:', error);
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prevLocale) => (prevLocale === 'id' ? 'en' : 'id'));
  }, []);

  const translate = useMemo(() => {
    return (key, replacements = {}) => {
      let translation = translations[locale]?.[key] || key;
      Object.keys(replacements).forEach((placeholder) => {
        translation = translation.replace(
          `{${placeholder}}`,
          replacements[placeholder]
        );
      });
      return translation;
    };
  }, [locale]);

  const contextValue = useMemo(
    () => ({
      locale,
      toggleLocale,
      translate,
    }),
    [locale, toggleLocale, translate]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
