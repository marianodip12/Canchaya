import { useUI } from "./store/ui";
import { AuthBar } from "./components/AuthBar";
import { Toast } from "./components/Toast";
import { IcoSearch, IcoUsers, IcoTrophy } from "./components/icons";
import { SearchView } from "./features/search/SearchView";
import { PlayView } from "./features/play/PlayView";
import { TournamentsView } from "./features/tournaments/TournamentsView";
import { AdminView } from "./features/admin/AdminView";

const NAV: [("buscar" | "jugar" | "torneos"), string, JSX.Element][] = [
  ["buscar", "Buscar", <IcoSearch />],
  ["jugar", "Jugar", <IcoUsers />],
  ["torneos", "Torneos", <IcoTrophy />],
];

export default function App() {
  const { view, setView } = useUI();
  const isAdmin = view === "admin";

  return (
    <div className="vt-root">
      <div className="vt-flood l" /><div className="vt-flood r" />
      <div className="vt-wrap">
        <header className="vt-top">
          <div>
            <span className="vt-eyebrow">
              {isAdmin ? "Panel del dueño" : view === "jugar" ? "Buscá con quién jugar" : view === "torneos" ? "Competí" : "Encontrá tu cancha"}
            </span>
            <h1 className="vt-h1"><span className="accent">Fútbol</span> · <span className="accent2">Pádel</span> · <span className="accent3">Tenis</span></h1>
            <div className="vt-venue">Zona Oeste · Buenos Aires</div>
          </div>
          <div className="vt-toprt">
            <AuthBar />
            <button className={"vt-mode" + (isAdmin ? " admin" : "")} onClick={() => setView(isAdmin ? "buscar" : "admin")}>
              {isAdmin ? "← Volver" : "⚙ Modo admin"}
            </button>
          </div>
        </header>

        {!isAdmin && (
          <nav className="vt-nav">
            {NAV.map(([k, label, ico]) => (
              <button key={k} className={"vt-navb" + (view === k ? " on" : "")} onClick={() => setView(k)}>{ico}{label}</button>
            ))}
          </nav>
        )}

        {view === "buscar" && <SearchView />}
        {view === "jugar" && <PlayView />}
        {view === "torneos" && <TournamentsView />}
        {view === "admin" && <AdminView />}
      </div>
      <Toast />
    </div>
  );
}
