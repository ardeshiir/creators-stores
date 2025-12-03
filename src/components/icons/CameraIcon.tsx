import Image from 'next/image'

const CameraIcon = ({ color }: { color?: string }) => {
  return <Image src="/icons/camera-icon.png" alt="camera-icon" width={16} height={14} />
}

export default CameraIcon
