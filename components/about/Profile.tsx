import React from 'react'
import ProfileCard from '../ProfileCard'

function Profile() {
  return (
    <div>
<ProfileCard
  name="Javi A. Torres"
  title="Software Engineer"
  handle="MD ABU SAHID"
  status="Online"
  contactText="Contact Me"
  avatarUrl="/path/to/avatar.jpg"
  showUserInfo={true}
  enableTilt={true}
  enableMobileTilt={false}
  onContactClick={() => console.log('Contact clicked')}
/>
    </div>
  )
}

export default Profile