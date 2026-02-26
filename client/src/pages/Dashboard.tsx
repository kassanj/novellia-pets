import { useQuery } from '@tanstack/react-query'
import { Heading, Text, Spinner, Card, Flex, Box } from '@chakra-ui/react'
import { getDashboardStats } from '../../lib/api';
import { NumberGraph } from '../components/graphs/NumberGraph';
import { AnimalTypePieGraph } from '../components/graphs/AnimalTypePieGraph';
import { AnimalTypeCountGraph } from '../components/graphs/AnimalTypeCountGraph';
import PetsWithLastVaccine from '../components/graphs/PetsWithLastVaccine';
import PetsWithNoVaccine from '../components/graphs/PetsWithNoVaccine';

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
   
      {/* {data && data.totalPets > 0 && (  */}
        <Flex direction={{ base: 'column', md: 'row' }} gap="3" width="100%">

          <Flex direction="column" flex={2} minW={0} gap="3">

            {/* First two columns + table underneath */}
            <Flex direction={{ base: 'column', md: 'row' }} gap="3" flex={1}>
              <Box flex={1} minW={0}>
                {data && data.totalPets > 0 && (
                  <NumberGraph total={data.totalPets} title="Total pets" />
                )}

                {data && data.upcomingVaccines.length > 0 && (
                  <NumberGraph total={data.upcomingVaccines.length} title="Upcoming vaccines" />
                )}
              </Box>

              <Box flex={1} minW={0}>
                {data && data.severeAllergies > 0 && (
                  <NumberGraph total={data.severeAllergies} title="Severe allergies" />
                )}

                {data && data.totalRecords > 0 && (
                  <NumberGraph total={data.totalRecords} title="Total medical records" />
                )}
              </Box>
            </Flex>

            {/* Vaccines tables */}
            {data && data.petsWithLastVaccine?.length > 0 && (
              <PetsWithLastVaccine petData={data.petsWithLastVaccine} />
            )}

            {data && data.petsWithNoVaccine?.length > 0 && (
              <PetsWithNoVaccine petData={data.petsWithNoVaccine} />
            )}
          </Flex>

          {/* Animal type graphs - pie chart and count graph */}
          <Box flex={2} minW={0}>
            {data && data.totalRecords > 0 && (
              <Card.Root borderColor="gray.200" borderWidth="1px" borderRadius="md" mb="2" p="4">
                <Card.Body>
                  <AnimalTypePieGraph data={data.petsByType} />
                </Card.Body>
              </Card.Root>
            )}

            {data && data.petsByType.length > 0 && (
              <Card.Root borderColor="gray.200" borderWidth="1px" borderRadius="md" mb="2">
                <Card.Body>
                  <AnimalTypeCountGraph data={data.petsByType} />
                </Card.Body>
              </Card.Root>
            )}
          </Box>
        </Flex>
      {/* )} */}
    </>
  )
}

export default Dashboard;
