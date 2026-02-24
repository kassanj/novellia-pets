import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './components/PageLayout'
import Dashboard from './pages/Dashboard'
import PetList from './pages/PetList'
import PetDetail from './pages/PetDetail'
import PetForm from './pages/PetForm'

export default function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/new" element={<PetForm />} />
          <Route path="/pets/:id/edit" element={<PetForm />} />
          <Route path="/pets/:id" element={<PetDetail />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  )
}