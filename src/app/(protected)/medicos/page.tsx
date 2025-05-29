import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const MedicosPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Medicos</PageTitle>
          <PageDescription>
            Gerencie os medicos cadastrados no sistema
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Plus />
            Adicionar Medico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>medicos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default MedicosPage;
