type Props = {
	onDelete: () => void;
	onCancel: () => void;
	deletedItem: string;
};

const ConfirmDelete = ({ onDelete, onCancel, deletedItem }: Props) => {
	return (
		<div className="fixed w-full h-full z-10 left-0 top-0 bg-opacity-30 bg-black flex justify-center items-center">
			<div className="background">
				<p className="text-2xl mb-4 text-center font-bold">
					Confirm Deletion
				</p>
				<p className="opacity-70 text-center">
					Are you sure you want to delete {deletedItem}
				</p>
				<div className="flex items-center justify-center mt-6">
					<button className="gbtn mr-4" onClick={onCancel}>
						Cancel
					</button>
					<button className="btn" onClick={onDelete}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDelete;
