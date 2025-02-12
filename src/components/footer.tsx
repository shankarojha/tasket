export default function Footer() {
    return (
      <footer className="bg-text text-white py-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Shankar Ojha</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="https://www.linkedin.com/in/shankar-ojha/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <span>|</span>
          <a
            href="https://github.com/shankarojha/tasket"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </footer>
    );
  }
  