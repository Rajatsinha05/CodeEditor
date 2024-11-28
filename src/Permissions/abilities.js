// import { AbilityBuilder, Ability } from '@casl/ability';

// export const defineAbilitiesFor = (user) => {
//   const { can, cannot, build } = new AbilityBuilder(Ability);

//   if (user.role === 'SUPERADMIN') {
//     can('manage', 'all'); // Full access to everything
//   } else if (user.role === 'ADMIN') {
//     can('read', 'User');
//     can('update', 'User', { branchCode: user.branchCode }); // Can update users in the same branch
//     can('delete', 'User', { branchCode: user.branchCode }); // Can delete users in the same branch
//     cannot('manage', 'all'); // Cannot manage other resources
//   } else if (user.role === 'STUDENT') {
//     can('read', 'Profile', { id: user.id }); // Can only view their own profile
//     cannot('manage', 'User'); // Cannot manage users
//   }

//   return build();
// };
