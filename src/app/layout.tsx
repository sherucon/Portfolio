import './globals.css';
import Navbar from './components/navbar';
import Cursor from './components/cursor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <Cursor />
                <Navbar />
                {children}
            </body>
        </html>
    )
}
