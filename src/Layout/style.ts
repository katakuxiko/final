import styled from "styled-components";

export const LayoutWrapper = styled.div`
	min-height: 100vh;
	min-width: 100vw;
	background-color: #f1f1f1f1;

	display: flex;
	justify-content: center;

	.content {
		box-shadow: 0px 0px 4px 0px rgba(34, 60, 80, 0.4);
		width: 100%;
		background-color: white;
		max-width: 800px;
		padding: 20px;
	}
`;
