	private static String getDirection(float x1, float x2, float y1, float y2) {
		
		String horizontal = "";
		String vertical = "";
		
		if (x1 < x2)  {
			horizontal = "right";
		}
		else if (x1 > x2) {
			horizontal = "left";
		}
		else {
			horizontal = "none";
		}
		
		if (y1 < y2) {
			vertical = "down";
		}
		else if (y1 > y2) {
			vertical = "up";
		}
		else {
			vertical = "none";
		}		

		return horizontal + "-" + vertical;
	
	}
