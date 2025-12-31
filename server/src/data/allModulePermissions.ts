type TModulePermission = {
	moduleName: string;
	permissions: {
		displayName: string;
		uniqueName: string;
		applicableToPanelTypes: ("superAdmin" | "client" | "brand")[];
		isReadPermission?: boolean;
	}[];
};

const allModulePermissions: TModulePermission[] = [
	{
		moduleName: "Industry",
		permissions: [
			{
				displayName: "Create Industry",
				uniqueName: "create_industry",
				applicableToPanelTypes: ["superAdmin"],
			},
			{
				displayName: "Read Industry",
				uniqueName: "read_industry",
				applicableToPanelTypes: ["superAdmin"],
				isReadPermission: true,
			},
			{
				displayName: "Update Industry",
				uniqueName: "update_industry",
				applicableToPanelTypes: ["superAdmin"],
			},
			{
				displayName: "Delete Industry",
				uniqueName: "delete_industry",
				applicableToPanelTypes: ["superAdmin"],
			},
		],
	},
	{
		moduleName: "Panel User",
		permissions: [
			{
				displayName: "Create Panel User",
				uniqueName: "create_panel_user",
				applicableToPanelTypes: ["superAdmin"],
			},
			{
				displayName: "Read Panel User",
				uniqueName: "read_panel_user",
				applicableToPanelTypes: ["superAdmin"],
				isReadPermission: true,
			},
			{
				displayName: "Update Panel User",
				uniqueName: "update_panel_user",
				applicableToPanelTypes: ["superAdmin"],
			},
			{
				displayName: "Delete Panel User",
				uniqueName: "delete_panel_user",
				applicableToPanelTypes: ["superAdmin"],
			},
		],
	},
];

export default allModulePermissions;
