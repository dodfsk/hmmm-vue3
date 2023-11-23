<template>
	<div class="homepage-container">
		<div class="homepage-box">
			<div class="header">
				<n-divider title-placement="left">
					<h2>创作中心</h2>
				</n-divider>
			</div>

			<div class="content">
				<n-card
					title="数据概览"
					:segmented="{
						content: true,
					}"
				>
					<div class="stats-grid">
						<n-statistic label="你一共发布了" tabular-nums>
							<n-number-animation ref="numberAnimationInstRef" :from="0" :to="114" />
							<template #suffix> 篇文章 </template>
						</n-statistic>

						<n-statistic label="你一共绘制了" tabular-nums>
							<n-number-animation ref="numberAnimationInstRef" :from="0" :to="514" />
							<template #suffix> 个房间 </template>
						</n-statistic>

						<n-statistic label="你一共一共一共" tabular-nums>
							<n-number-animation ref="numberAnimationInstRef" :from="0" :to="1919" />
							<template #suffix> 次请求 </template>
						</n-statistic>
					</div>
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
	background: #e9ecef;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
}
.homepage-box {
	width: 100%;
	max-width: 960px;
	height: 100%;
	padding: 30px;
	background-color: #fff;
	// border-radius: 3px;
	box-shadow: 0 0 3px rgba(51, 51, 51, 0.321);
	display: flex;
	flex-direction: column;
	align-items: center;

	.header {
		width: 100%;
		// min-width:500px;
		margin-bottom: 20px;
		display: flex;
		justify-content: center;
	}
	.content {
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 24px;
	}
}
.stats-grid{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	// grid-template-rows: repeat(3, 1fr);
	grid-gap: 20px 12px;
}
</style>
