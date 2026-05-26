import { UserRole } from '@/features/auth/auth.types';
import { QualificationsCard } from '@/features/qualifications';
import { getProfileSections } from '../profile.config';
import { ManagedProjectsCard } from './ManagedProjectsCard';
import { OwnedGroupsCard } from './OwnedGroupsCard';
import { ProjectMembershipCard } from './ProjectMembershipCard';
import { SubordinatesCard } from './SubordinatesCard';
import { WorkloadCard } from './WorkloadCard';

interface ProfileSectionsProps {
  userId: string;
  role: UserRole;
  editable?: boolean;
}

export const ProfileSections = ({ userId, role, editable = false }: ProfileSectionsProps) => {
  const sections = getProfileSections(role);

  return (
    <>
      {sections.qualifications && (
        editable
          ? <QualificationsCard />
          : <QualificationsCard userId={userId} readOnly />
      )}
      {sections.memberships && <ProjectMembershipCard userId={userId} />}
      {sections.workload && <WorkloadCard userId={userId} />}
      {sections.subordinates && <SubordinatesCard userId={userId} />}
      {sections.projects && <ManagedProjectsCard userId={userId} />}
      {sections.ownedGroups && <OwnedGroupsCard userId={userId} />}
    </>
  );
};
