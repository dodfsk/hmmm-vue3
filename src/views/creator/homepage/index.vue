<template>
	<div class="homepage-container">
		<div class="homepage-box">
			<div class="header">
				<div class="header-left">
					<h2>创作中心</h2>
					<hr />
				</div>
			</div>

			<div class="content">
				<n-card
					title="数据概览"
					:segmented="{
						content: true,
					}"
				>
					<n-row>
						<n-col :span="8">
							<n-statistic label="你一共发布了" tabular-nums style="width: 200px">
								<n-number-animation ref="numberAnimationInstRef" :from="0" :to="114" />
								<template #suffix> 篇文章 </template>
							</n-statistic>
						</n-col>

						<n-col :span="8">
							<n-statistic label="你一共绘制了" tabular-nums>
								<n-number-animation ref="numberAnimationInstRef" :from="0" :to="514" />
								<template #suffix> 个房间 </template>
							</n-statistic>
						</n-col>

						<n-col :span="8">
							<n-statistic label="你一共一共一共" tabular-nums>
								<n-number-animation ref="numberAnimationInstRef" :from="0" :to="1919" />
								<template #suffix> 次请求 </template>
							</n-statistic>
						</n-col>

					</n-row>
				</n-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.homepage-container {
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}
.homepage-box {
	width: 1200px;
	height: 100%;
	padding: 30px;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.721);
	display: flex;
	flex-direction: column;
	align-items: center;

	.header {
		width: 100%;
		// min-width:500px;
		margin-bottom: 20px;
		display: flex;
		justify-content: center;
		&-left {
			width: 70%;
			text-align: left;
			hr {
				width: 50%;
				min-width: 286px;
				color: '#ccc';
			}
		}
	}
	.content {
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 24px;
	}
}


</style>
