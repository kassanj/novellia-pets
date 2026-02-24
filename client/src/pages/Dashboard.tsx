import { useQuery } from '@tanstack/react-query'
import { Heading, Text, Spinner } from '@chakra-ui/react'
import { getDashboardStats } from '../../lib/api';

const Dashboard = () => {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats()
  })

  if (isLoading) return <Spinner />
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <>
      <Heading as="h1" py="4">Dashboard</Heading>

      {data && data.totalPets === 0 && (
        <Text>No pets found</Text>
      )}

      {data && data.totalPets > 0 && (
        <Text>Total pets: {data.totalPets}</Text>
      )}

      {data && data.petsByType.length > 0 && (
        <Text>Pets by animal type: {data.petsByType.map((p: { type: string; count: number }) => `${p.type}: ${p.count}`).join(', ')}</Text>
      )}

      {data && data.upcomingVaccines.length > 0 && (
        <Text>Upcoming vaccines: {data.upcomingVaccines.length}</Text>
      )}

      {data && data.severeAllergies > 0 && (
        <Text>Severe allergies: {data.severeAllergies}</Text>
      )}

      {data && data.totalRecords > 0 && (
        <Text>Total medical records: {data.totalRecords}</Text>
      )}


      {/* <Text>{JSON.stringify(data, null, 2)}</Text> */}
    </>
  )
}

export default Dashboard;
