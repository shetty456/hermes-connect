import type { Contact } from '@/types/contact'

interface Props {
  contact: Contact
}

export function ProfileCard({ contact }: Props) {
  return (
    <div className="space-y-1 border-b border-gray-100 pb-3">
      <p className="font-semibold text-gray-900 text-sm leading-tight">{contact.name}</p>
      {contact.role && <p className="text-xs text-gray-600">{contact.role}</p>}
      {contact.company && <p className="text-xs text-gray-500">{contact.company}</p>}
    </div>
  )
}
