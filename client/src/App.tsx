import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster, Toast } from '@chakra-ui/react'
import PageLayout from './components/PageLayout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import PetList from './pages/PetList.tsx'
import PetDetail from './pages/PetDetail.tsx'
import PetForm from './pages/PetForm.tsx'
import { toaster } from './lib/toaster.ts'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root w="300px">
            <Toast.Indicator />
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </Toaster>
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