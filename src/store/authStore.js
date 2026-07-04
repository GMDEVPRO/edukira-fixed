import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth store — única fonte de verdade.
 *
 * AuthResponse do backend:
 *   { accessToken, refreshToken, role, preferredLanguage, school: { id, name, country, type } }
 *
 * StudentAuthResponse do backend:
 *   { accessToken, refreshToken, studentAccountId, fullName, accountStatus,
 *     preferredLanguage, school: { id, name, country }, isLinked }
 */
const useAuthStore = create(
  persist(
    (set) => ({
      token:        null,
      refreshToken: null,
      user:         null,
      school:       null,

      /* ── Admin/Teacher login ── */
      login: (data) => set({
        token:        data.accessToken,
        refreshToken: data.refreshToken ?? null,
        user: {
          role:     data.role,
          language: data.preferredLanguage ?? 'fr',
          name:     data.adminFirstName
                      ? `${data.adminFirstName} ${data.adminLastName ?? ''}`.trim()
                      : (data.name ?? ''),
        },
        school: data.school
          ? {
              id:      data.school.id,
              name:    data.school.name,
              country: data.school.country,
              type:    data.school.type ?? null,
            }
          : null,
      }),

      /* ── Student login ── */
      loginStudent: (data) => set({
        token:        data.accessToken,
        refreshToken: data.refreshToken ?? null,
        user: {
          role:          'STUDENT',
          language:      data.preferredLanguage ?? 'fr',
          name:          data.fullName ?? '',
          accountId:     data.studentAccountId ?? null,
          accountStatus: data.accountStatus ?? 'ACTIVE',
          isLinked:      data.isLinked ?? false,
        },
        school: data.school
          ? {
              id:      data.school.id,
              name:    data.school.name,
              country: data.school.country,
            }
          : null,
      }),

      logout: () => set({ token: null, refreshToken: null, user: null, school: null }),
      setSchool: (school) => set({ school }),
      updateToken: (token) => set({ token }),
    }),
    {
      name: 'edukira_auth',
      partialize: (s) => ({
        token:        s.token,
        refreshToken: s.refreshToken,
        user:         s.user,
        school:       s.school,
      }),
    }
  )
)

export default useAuthStore
