import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import BanPickPage from "@/pages/BanPickPage/BanPickPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BanPickPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
